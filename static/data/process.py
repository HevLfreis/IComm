#!/usr/bin/env python
# coding: utf-8
# created by hevlhayt@foxmail.com 
# Date: 2016/3/22 
# Time: 10:10
#
import json
import os
#
# file = open('stations', 'r')
# # newf = open('stations', 'wb')
#
# # for l in file:
# #     l = l.strip()
# #     a = l.replace(chr(1), '\t')
# #     print a
# #     # newf.write(a)
# #
# # # newf.close()
# # file.close()
#
# locations = {}
# path = os.path.abspath('..')
# print path
# # file = open(path, 'r')
# for l in file:
#     l = l.rstrip('\n')
#     loc = l.split('\t')
#     if len(loc[1]) < 1:
#         continue
#     locations.setdefault(loc[0], [float(loc[1]), float(loc[2])])
#
# print locations[0:10]
import random

# n = ["normal", "job1", "job2", "jobn", "lazy", "chaos"]
# p = {}
# a = 0
# for i in range(5):
#     tmp = random.randint(0, 100-a)
#     print tmp
#     p.setdefault(n[i], tmp/100.0)
#     a += tmp
# p.setdefault(n[5], (100-a)/100.0)
#
# print p
#
# a = "12325435"
# print a[0:-3]
import urllib2
lng = 121.48
lat = 31.22
# sug_word = ['美食', '银行', '商店', '医院', '北京']
# print sug_word
# for word in sug_word:
#     print word
#     word=urllib2.quote(word)
#     try:
#         url = 'http://api.map.baidu.com/place/v2/search?query=' \
#               + word +'&page_size=10&page_num=0&scope=1&location=' \
#               + str(lat) + ',' + str(lng) +'&radius=2000&output=json&ak=QdzoydNb3Ix9Qfik2sbRrOfm'
#         print url
#         response = urllib2.urlopen(url)
#         data = json.load(response)
#
#         print word, data.get('total')
#     except Exception, e:
#         print e

sug = {"restaurant": 0, "bank": 0, "shop": 0, "clinic": 0}
for k, v in sug.items():
    print k
    if random.random() > 0.3:
        sug.update({k: random.randint(0, 10)})
