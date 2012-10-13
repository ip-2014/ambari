/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = Em.Route.extend({
  route:'/main',
  enter:function (router) {
    console.log('in /main:enter');
    if (router.getAuthenticated()) {
      // TODO: redirect to last known state
      /*
       Ember.run.next(function () {
       router.transitionTo('step' + router.getInstallerCurrentStep());
       });
       */
    } else {
      Ember.run.next(function () {
        router.transitionTo('login');
      });
    }
  },

  index:Ember.Route.extend({
    route:'/',
    redirectsTo:'dashboard'
  }),

  connectOutlets:function (router, context) {
    router.get('applicationController').connectOutlet('main');
  },

  charts:Em.Route.extend({
    route:'/charts',
    connectOutlets:function (router, context) {
      router.get('mainController').connectOutlet('mainCharts');
    },
    enter:function (router) {
      Em.run.next(function () {
        router.transitionTo('heatmap');
      });
    },
    index: Ember.Route.extend({
      route: '/',
      redirectsTo: 'heatmap'
    }),
    heatmap: Em.Route.extend({
      route:'/heatmap',
      connectOutlets: function(router, context) {
        router.get('mainChartsController').connectOutlet('mainChartsHeatmap');
      }
    }),
    horizon_chart: Em.Route.extend({
      route:'/horizon_chart',
      connectOutlets: function(router, context) {
        router.get('mainChartsController').connectOutlet('mainChartsHorizon');
      }
    }),
    showChart:function (router, event) {
      var parent = event.view._parentView;
      parent.deactivateChildViews();
      event.view.set('active', "active");
      router.transitionTo(event.context);
    }
  }),

  hosts:Em.Route.extend({
    route:'/hosts',
    connectOutlets:function (router, context) {
      router.get('mainController').connectOutlet('mainHost');
    },

    showDetails:function (router, event) {
      router.get('mainHostDetailsController').setBack(true);
      router.transitionTo('hostDetails.index', event.context)
    }

  }),

  hostDetails:Em.Route.extend({
    route:'/hosts/:host_id',
    connectOutlets:function (router, host) {
      router.get('mainController').connectOutlet('mainHostDetails', host);
    },

    index:Ember.Route.extend({
      route:'/',
      redirectsTo:'summary'
    }),

    backToHostsList:function (router, event) {
      router.transitionTo('hosts');
    },

    summary:Em.Route.extend({
      route:'/summary',
      connectOutlets:function (router, context) {
        router.get('mainHostDetailsController').connectOutlet('mainHostSummary');
      }
    }),

    metrics:Em.Route.extend({
      route:'/metrics',
      connectOutlets:function (router, context) {
        router.get('mainHostDetailsController').connectOutlet('mainHostMetrics');
      }
    }),

    audit:Em.Route.extend({
      route:'/audit',
      connectOutlets:function (router, context) {
        router.get('mainHostDetailsController').connectOutlet('mainHostAudit');
      }
    }),

    hostNavigate:function (router, event) {
      var parent = event.view._parentView;
      parent.deactivateChildViews();
      event.view.set('active', "active");
      router.transitionTo(event.context);
    }
  }),

  admin:Em.Route.extend({
    route:'/admin',

    enter: function(router) {
      if(router.get('currentState.name') != 'main') { // is user comes from main -> navigate to users
        Em.run.next(function () {
          router.transitionTo('adminUser');
        });
      }
    },

    connectOutlets:function (router, context) {
      router.get('mainController').connectOutlet('mainAdmin');
    },

    adminUser:Em.Route.extend({
      route:'/user',
      enter:function (router) {
        router.set('mainAdminController.category', "user");
        Em.run.next(function () {
          router.transitionTo('allUsers');
        });
      },

      // events
      gotoUsers:Em.Router.transitionTo("allUsers"),
      gotoCreateUser:Em.Router.transitionTo("createUser"),
      gotoEditUser:function (router, event) { router.transitionTo("editUser", event.context) },

      // states
      allUsers:Em.Route.extend({
        route:'/',
        connectOutlets:function (router) {
          router.get('mainAdminController').connectOutlet('mainAdminUser');
        }
      }),

      createUser:Em.Route.extend({
        route:'/create',
        connectOutlets:function (router) {
          router.get('mainAdminController').connectOutlet('mainAdminUserEdit', {});
        }
      }),

      editUser:Em.Route.extend({
        route:'/edit/:userName',
        connectOutlets:function (router, user) {
          router.get('mainAdminController').connectOutlet('mainAdminUserEdit', user);
        }
      }),
    }),

    adminAuthentication:Em.Route.extend({
      route:'/authentication',
      connectOutlets:function (router) {
        router.set('mainAdminController.category', "authentication");
        router.get('mainAdminController').connectOutlet('mainAdminAuthentication');
      }
    }),

    adminSecurity:Em.Route.extend({
      route:'/security',
      connectOutlets:function (router) {
        router.set('mainAdminController.category', "security");
        router.get('mainAdminController').connectOutlet('mainAdminSecurity');
      }
    }),

    adminAdvanced:Em.Route.extend({
      route:'/advanced',
      connectOutlets:function (router) {
        router.set('mainAdminController.category', "advanced");
        router.get('mainAdminController').connectOutlet('mainAdminAdvanced');
      }
    }),

    adminAudit:Em.Route.extend({
      route:'/audit',
      connectOutlets:function (router) {
        router.set('mainAdminController.category', "audit");
        router.get('mainAdminController').connectOutlet('mainAdminAudit');
      }
    }),

    adminNavigate:function (router, object) {
      Em.run.next(function () {
        router.transitionTo('admin' + object.context.capitalize());
      });
    }
  }),

  dashboard:Em.Route.extend({
    route:'/dashboard',
    connectOutlets:function (router, context) {
      router.get('mainController').connectOutlet('mainDashboard');
    }
  }),

  services:Em.Route.extend({
    route:'/services',
    index:Ember.Route.extend({
      route:'/'
    }),
    enter:function (router) {
      Ember.run.next(function () {
        var service = router.get('mainServiceItemController.content');
        if (!service) {
          service = App.Service.find(1); // getting the first service to display
        }
        router.transitionTo('service.summary', service);
      });
    },
    connectOutlets:function (router, context) {
      router.get('mainController').connectOutlet('mainService');
    },
    service:Em.Route.extend({
      route:'/:service_id',
      connectOutlets:function (router, service) {
//        if (service.name == "undefined") {
//          service = App.Service.find(1);
//        }
        router.get('mainServiceController').connectOutlet('mainServiceItem', service);
        router.transitionTo('summary');
      },
      index:Ember.Route.extend({
        route:'/'
      }),
      summary:Em.Route.extend({
        route:'/summary',
        connectOutlets:function (router, context) {
          var item = router.get('mainServiceItemController.content');
          router.get('mainServiceItemController').connectOutlet('mainServiceInfoSummary', item);
        }
      }),
      metrics:Em.Route.extend({
        route:'/metrics',
        connectOutlets:function (router, context) {
          var item = router.get('mainServiceItemController.content');
          router.get('mainServiceItemController').connectOutlet('mainServiceInfoMetrics', item);
        }
      }),
      configs:Em.Route.extend({
        route:'/configs',
        connectOutlets:function (router, context) {
          var item = router.get('mainServiceItemController.content');
          router.get('mainServiceItemController').connectOutlet('mainServiceInfoConfigs', item);
        }
      }),
      audit:Em.Route.extend({
        route:'/audit',
        connectOutlets:function (router, context) {
          var item = router.get('mainServiceItemController.content');
          router.get('mainServiceItemController').connectOutlet('mainServiceInfoAudit', item);
        }
      }),
      showInfo:function (router, event) {
        var parent = event.view._parentView;
        parent.deactivateChildViews();
        event.view.set('active', "active");
        router.transitionTo(event.context);
      }
    }),
    showService:Em.Router.transitionTo('service')
  }),

  selectService:Em.Route.transitionTo('services.service'),
  selectHost:function (router, event) {
    router.get('mainHostDetailsController').setBack(false);
    router.transitionTo('hostDetails.index', event.context);
  },
  filterHosts:function (router, component) {
    router.get('mainHostController').filterByComponent(component.context);
    router.transitionTo('hosts');
  },
  navigate:function (router, event) {
    var parent = event.view._parentView;
    parent.deactivateChildViews(event.context);
    router.transitionTo(event.context.routing);
  }
});