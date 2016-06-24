#!/usr/bin/env python
# coding: utf-8
# created by hevlhayt@foxmail.com
# Date: 2016/6/24
# Time: 8:50

import json
import urllib2

import math
from flask import Flask, render_template, jsonify, request

from init import app, STAT_INFO, logger


@app.route('/')
def welcome():
    return render_template('welcome.html')


@app.route('/map')
def map():
    logger.info('('+request.remote_addr+')')
    return render_template('index.html')


@app.route('/stations')
def stations():
    return jsonify(json_stations())


@app.route('/preinfo/')
def preinfo():
    try:
        lng = float(request.args['lng'])
        lat = float(request.args['lat'])
    except Exception:
        lng = 121.48
        lat = 31.22
    return jsonify(json_preinfo(lng, lat))


@app.route('/info/')
def info():
    try:
        lng = float(request.args['lng'])
        lat = float(request.args['lat'])
    except Exception:
        lng = 121.48
        lat = 31.22
    return jsonify(json_info(lng, lat))


########################################################################


def json_stations():
    return {k: v.get('loc') for k, v in STAT_INFO.items()}


def json_info(lng, lat):
    # print lng, lat

    # stat = findStat(lng, lat)
    stats = find_stats(lng, lat, 1.0)
    if len(stats) == 0:
        stats.append(find_stat(lng, lat))

    # print stat
    stat_num = len(stats)
    r, kw = {}, {}
    p, total = [0, 0, 0], 0
    for stat in stats:
        p = [x + y for x, y in zip(STAT_INFO[stat]['people'], p)]

    p = [t / stat_num for t in p]
    # print p

    for stat in stats:
        total += sum(v for k, v in STAT_INFO[stat]['kw'].items())

        kw.update({k: v for k, v in STAT_INFO[stat]['kw'].items()})
        if len(kw) > 10:
            break

    for k, v in kw.items():
        kw[k] = round(float(v)/total, 2)

    # print kw
    # print stat_info[stat]['kw']

    sug = {"restaurant": 0, "bank": 0, "shop": 0, "clinic": 0, "hotel": 0, "school": 0}
    kword = ['美食', '银行', '超市', '医院', '酒店', '学校', ]
    kindex = {1: "restaurant", 2: "bank", 3: "shop", 4: "clinic", 5: "hotel", 6: "school"}
    # print sug_word

    i = 1
    for word in kword:
        word2 = urllib2.quote(word)

        try:
            url = 'http://api.map.baidu.com/place/v2/search?query=' \
                  + word2 +'&page_size=10&page_num=0&scope=1&location=' \
                  + str(lat) + ',' + str(lng) +'&radius=1000&output=json&ak=QdzoydNb3Ix9Qfik2sbRrOfm'
            response = urllib2.urlopen(url)
            data = json.load(response)
            # print url
            # print word, data.get('total')
            # print sug_index.get(i)
            sug.update({kindex.get(i): int(data.get('total'))})

        except Exception, e:
            sug.update({i: 0})
            # print e
        finally:
            i += 1

    # print sug

    r.setdefault('people', p)
    r.setdefault('kw', kw)
    r.setdefault('sug', sug)
    r.setdefault('stat', STAT_INFO[stats[0]]['date'])

    return r


def json_preinfo(lng, lat):
    stat = find_stat(lng, lat)
    # print {'space': stat_info[stat]['space'], 'max15': stat_info[stat]['max15'],
    #        'max67': stat_info[stat]['max67']}
    return {'stat': stat, 'space': STAT_INFO[stat]['space'], 'max15': STAT_INFO[stat]['max15'],
                      'max67': STAT_INFO[stat]['max67']}


def find_stat(lng, lat):
    m = 100000.0
    stat = ''
    for k, v in STAT_INFO.items():
        # print k, v.get('loc')
        if v.get('loc') is not None:

            dist = (lng - float(v.get('loc')[0])) * (lng - float(v.get('loc')[0])) + (lat - float(v.get('loc')[1])) * (lat - float(v.get('loc')[1]))
            # print m, dist, k, lng, lat,float(v.get('loc')[0]), (v.get('loc')[1])
            if dist < m:
                m = dist
                stat = k

    return stat


def find_stats(lng, lat, r):

    stats = []
    stat_dist = {}
    for k, v in STAT_INFO.items():
        # print k, v.get('loc')
        if v.get('loc') is not None:
            stat_dist[k] = math.sqrt((lng - float(v.get('loc')[0])) * (lng - float(v.get('loc')[0])) +
                                    (lat - float(v.get('loc')[1])) * (lat - float(v.get('loc')[1])))

    for k, v in sorted(stat_dist.items(), key=lambda x: x[1]):
        # print k, v
        if v * 111 < r:
            stats.append(k)
        else:
            break

    return stats


if __name__ == '__main__':
    app.run()
