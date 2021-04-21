// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/wancheng/Documents/GitHub/electron-app-template/render2/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/login",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Login__index' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/pages/Login/index'), loading: LoadingComponent}),
    "exact": true
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/layouts/SecurityLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/layouts/BasicLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/",
            "redirect": "/home",
            "exact": true
          },
          {
            "path": "/home",
            "name": "home",
            "icon": "smile",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Home' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/pages/Home'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/test",
            "name": "test",
            "icon": "smile",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Test' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/pages/Test'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__errorPage__404' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/pages/errorPage/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__errorPage__404' */'/Users/wancheng/Documents/GitHub/electron-app-template/render2/src/pages/errorPage/404'), loading: LoadingComponent}),
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
