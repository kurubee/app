/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace MathJax
*/
try {
    (function () {
    // Exceptions Catcher Begins
        Ext.define('DrGlearning.controller.activities.TemporalController', {
            extend: 'Ext.app.Controller',
            activity: null,
            score: null,
            init: function ()
            {
                this.levelController = this.getApplication().getController('LevelController');
                this.careersListController = this.getApplication().getController('CareersListController');
                this.activityController = this.getApplication().getController('ActivityController');
                this.daoController = this.getApplication().getController('DaoController');
                this.control({
                    'button[customId=after]': {
                        tap: this.after
                    },
                    'button[customId=before]': {
                        tap: this.before
                    }
                });
            },
            updateActivity: function (view, newActivity)
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading activity') + "…",
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/temporal.png'>",
                });
                this.activity = newActivity;
                if (view.down('component[customId=activity]')) {
                    view.down('component[customId=activity]').hide();
                    view.down('component[customId=activity]').destroy();
                }
                var activityView = Ext.create('DrGlearning.view.activities.Temporal');
                this.activityController.addQueryAndButtons(activityView, newActivity);
                newActivity.getImage('image', 'image', activityView.down('[id=image]'), this, view, activityView, false);
            },
            loadingImages: function (view, activityView)
            {
                activityView.show();
                view.add(activityView);
                Ext.Viewport.setMasked(false);
                if (!this.activity.data.help) {
                    this.activity.data.help = true;
                    this.activity.save();
                    this.levelController.helpAndQuery();
                }
            },
            before: function ()
            {
                var attempts_html = "";
                if(this.careersListController.career.data.max_attempts > 0)
                {
                    attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                }
                this.score = 100;
                if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
                    var score_gradient = this.score - this.activity.data.score;
					if(score_gradient < 0){score_gradient=0;}
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' + attempts_html +"<br />"+ '+ <text style="color:#D4A017">$</text>' + score_gradient, function ()
                    {
                        this.daoController.activityPlayed(this.activity, true, this.score);
                    }, this);
                }
                else 
                {
                    this.careersListController.career.data.current_attempts--;
                    this.careersListController.career.save();
                    if(this.careersListController.career.data.max_attempts > 0)
                    {
                        attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                    }
                    if(this.careersListController.career.data.current_attempts>0 || this.careersListController.career.data.max_attempts==0)
                    {
                        Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext("Oh, oh. That isn't the right answer")+ '<br />' +attempts_html, function ()
                        {
                            this.daoController.activityPlayed(this.activity, false, 0);
                        }, this);
               
                    }else{
                        Ext.Msg.alert(i18n.gettext('Game Over'), i18n.translate("<p>You haven't got more attempts, this game is over. <br/> You got <text style='color:#D4A017'>$</text>%s.<br/>%s").fetch(this.daoController.getScoreOfCareer(this.careersListController.selectedcareer.data.id),this.daoController.renderTop5OfCareer(this.careersListController.selectedcareer.data.id)), function () {
                                                        this.daoController.activityPlayed(this.activity, false, 0);
                        
                    });
                    
                    }
                }
            },
            after: function ()
            {
                var attempts_html = "";
                if(this.careersListController.career.data.max_attempts > 0)
                {
                    attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                }

                if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
                    this.score = 100;
                    var score_gradient = this.score - this.activity.data.score;
					if(score_gradient < 0){score_gradient=0;}
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' +attempts_html +"<br />"+ '+ <text style="color:#D4A017">$</text>' + score_gradient, function ()
                    {
                        this.daoController.activityPlayed(this.activity, true, this.score);
                    }, this);
                }
                else {
                    this.score = 0;
                    this.careersListController.career.data.current_attempts--;
                    this.careersListController.career.save();
                    var attempts_html = "";
                    if(this.careersListController.career.data.max_attempts > 0 )
                    {
                        attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                    }
                    if(this.careersListController.career.data.current_attempts>0  || this.careersListController.career.data.max_attempts==0)
                    {
                        Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty+ '<br />' +attempts_html, function ()
                        {
                            this.daoController.activityPlayed(this.activity, false, 0);
                        }, this);
                    }else{
                    Ext.Msg.alert(i18n.gettext('Game Over'), i18n.translate("<p>You haven't got more attempts, this game is over. <br/> You got <text style='color:#D4A017'>$</text>%s.<br/>%s").fetch(this.daoController.getScoreOfCareer(this.careersListController.selectedcareer.data.id),this.daoController.renderTop5OfCareer(this.careersListController.selectedcareer.data.id)), function () {
                                                    this.daoController.activityPlayed(this.activity, false, 0);
                    
                });
                    
                    }
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
