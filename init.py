#!/usr/bin/env python
# coding: utf-8
# created by hevlhayt@foxmail.com 
# Date: 2016/6/24
# Time: 8:50
import csv
import logging
import logging.config
import os

import yaml
from flask import Flask

app = Flask(__name__, static_folder='static')

logger_config = yaml.load(open(app.root_path+'/logging.conf'))
logger_config['handlers']['file']['filename'] = app.root_path + '/logs/icomm.log'
logging.config.dictConfig(logger_config)
logger = logging.getLogger('icomm_logger')


# path1 = os.path.abspath('..')+'/static/data/stations'
# path2 = os.path.abspath('..')+'/static/data/date.csv'
# path3 = os.path.abspath('..')+'/static/data/hour.csv'
# path4 = os.path.abspath('..')+'/static/data/hour_max.csv'
# path5 = os.path.abspath('..')+'/static/data/max.csv'
# path6 = os.path.abspath('..')+'/static/data/kw.csv'
# path7 = os.path.abspath('..')+'/static/data/people.csv'

path1 = app.static_folder+'/data/stations'
path2 = app.static_folder+'/data/date.csv'
path3 = app.static_folder+'/data/hour.csv'
path4 = app.static_folder+'/data/hour_max.csv'
path5 = app.static_folder+'/data/max.csv'
path6 = app.static_folder+'/data/kw.csv'
path7 = app.static_folder+'/data/people.csv'
path8 = app.static_folder+'/data/space.csv'

stations = open(path1, 'r')
date = open(path2, 'r')
date_csv = csv.reader(date)
hour = open(path3, 'r')
hour_csv = csv.reader(hour)
hour_max = open(path4, 'r')
hour_max_csv = csv.reader(hour_max)
max = open(path5, 'r')
max_csv = csv.reader(max)
kw = open(path6, 'r')
kw_csv = csv.reader(kw)
people = open(path7, 'r')
people_csv = csv.reader(people)
space = open(path8, 'r')
space_csv = csv.reader(space)

STAT_INFO = {stat: {'space': 0, 'kw': {}, 'max15': int(max15), 'max67': int(max67), 'max_hour': [0 for _ in range(24)],
                    'date': [0 for i in range(31)]} for stat, max15, max67 in max_csv}

for stat, hour, num in hour_max_csv:
    if stat in STAT_INFO:
        STAT_INFO[stat]['max_hour'][int(hour)] = num

for l in stations:
    # if i > 1000:
    #     break
    l = l.rstrip('\n')
    loc = l.split('\t')
    if len(loc[1]) < 1 or (loc[0] not in STAT_INFO):
        continue
    STAT_INFO[loc[0]]['loc'] = [float(loc[2]), float(loc[1])]

# print stat_info

for stat, date, num in date_csv:
    # print stat, date, num
    if stat in STAT_INFO:
        STAT_INFO[stat]['date'][int(date[-2:])] = {'aver': num, 'hour': [0 for i in range(24)]}

for stat, date, hour, num in hour_csv:
    if stat in STAT_INFO:
        STAT_INFO[stat]['date'][int(date[-2:])]['hour'][int(hour)] = num


for stat, live, work, other, all in people_csv:
    if stat in STAT_INFO:
        STAT_INFO[stat]['people'] = [int(live), int(work), int(other)]
# print stat_info['C0001']['people']

for stat, kw, index in kw_csv:
    # print stat, kw, index
    if stat in STAT_INFO:
        STAT_INFO[stat]['kw'][kw] = int(index)

for stat, t1, t2, space in space_csv:
    # print stat, t1, t2, space
    if stat in STAT_INFO and (space is '1' or space is '0'):
        STAT_INFO[stat]['space'] = int(space)
