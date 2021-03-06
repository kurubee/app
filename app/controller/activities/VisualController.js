/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace DrGlearning
*/
try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.activities.VisualController', {
            extend: 'Ext.app.Controller',
            view: null,
            activity: null,
            activityView: null,
            answers: null,
            finishtemp: null,
            secondtemp: null,
            currentTime: 0,
            score: 20,
            isStopped: false,
            loading: null,
            init: function ()
            {
                this.isStopped = false;
                this.levelController = this.getApplication().getController('LevelController');
                this.careersListController = this.getApplication().getController('CareersListController');
                this.activityController = this.getApplication().getController('ActivityController');
                this.daoController = this.getApplication().getController('DaoController');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                this.control({
                    'button[customId=respuesta]': {
                        tap: this.tryIt
                    },
                    'button[customId=skip]': {
                        tap: this.skip
                    }
                });
            },
            updateActivity: function (view, newActivity) 
            {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading activity') + "…",
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/visual.png'>",
                });
                this.loading = true;
                this.view = view;
                this.activity = newActivity;
                view.down('[customId=activity]').destroy();
                var activityView = Ext.create('DrGlearning.view.activities.Visual', 
                {
                    listeners: {
                        painted: function ()
                        {
                            DrGlearning.app.getApplication().getController('activities.VisualController').startGame();
                        }
                    }
                });
                this.activityView = activityView;
                view.add(activityView);
                activityView.show();
            },
            /**We wait for the painted event of the view to start the game...
             *
             */
            startGame: function ()
            {
                this.score = 20;
                this.imageContainer = this.activityView.down('container[id=image]');
                this.optionsContainer = this.activityView.down('container[customId=options]');
                this.timeLabel = this.activityView.down('label[customId=time]');
                this.obImageContainer = this.activityView.down('container[id=obImage]');
                this.imageContainer.setHtml('');
                this.activity.getImage('image', 'image', this.imageContainer, this, this.view, this.activityView, false);
                this.activityController.addQueryAndButtons(this.activityView, this.activity);
                this.answers = this.activity.data.answers;
                var time = this.activity.data.time;
                this.currentTime = time;
                this.optionsContainer.removeAll();
                this.optionsContainer.removeAll();
                this.timeLabel.setHtml(i18n.translate("%d second", "%d seconds").fetch(parseInt(this.currentTime, 10)));
                var that = this;
                this.secondtemp = setInterval(function () 
                {
                    that.showSeconds();
                }, 1000);
                this.imageContainer.show();
                //this.obImageContainer.hide();
                this.optionsContainer.hide();
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
                this.loading = false;
            },
            showAnswers: function () 
            {
                this.timeLabel.setHtml('');
                this.activityView.down('button[customId=skip]').hide();
                //this.obImageContainer.setHtml('<img class="activityImage" width="100%" alt="imagen" src="' + this.activity.data.obfuscated_image + '" />');
                this.optionsContainer.add({xtype: 'spacer'});
                for (var i = 0; i < this.answers.length; i++) {
                    if (this.answers[i].trim() === this.activity.data.correct_answer)
                    {
                        this.optionsContainer.add({
                            xtype: 'button',
                            text: this.answers[i].trim(),
                            margin: 3,
                            customId: 'respuesta',
                            answerNo: i + 1,
                            correctAnswer: true,
                            style: 'opacity: 0.9;'
                        });
                        this.correctAnswerId = i + 1;
                    } else {
                        this.optionsContainer.add({
                            xtype: 'button',
                            text: this.answers[i].trim(),
                            margin: 3,
                            customId: 'respuesta',
                            answerNo: i + 1,
                            style: 'opacity: 0.9;'
                        });
                    }
                }
                //this.imageContainer.hide();
                this.imageContainer.setHtml('<img class="activityImage" width="100%" alt="imagen" src="' + this.globalSettingsController.getServerURL() + '/media/' + this.activity.data.obfuscated_image_url + '" />');
                this.optionsContainer.show();
                this.optionsContainer.setStyle({backgroundImage: this.obImageUrl});
                //this.obImageContainer.show();
            },
            tryIt: function (target)
            {
                var attempts_html = "";
                if(this.careersListController.career.data.max_attempts > 0)
                {
                    attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                }
                if (target.config.answerNo === this.correctAnswerId) 
                {
                    if (this.score < 50)
                    {
                        this.score = 50;
                    }
                    var score_gradient = this.score - this.activity.data.score;
					if(score_gradient < 0){score_gradient=0;}
					
                    this.optionsContainer.down('button[correctAnswer=true]').setUi('confirm');
                    Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward + '<br />' + attempts_html +"<br />"+ '+ <text style="color:#D4A017">$</text>' + score_gradient, function ()
                    {
                        this.daoController.activityPlayed(this.activity, true, this.score);
                    }, this);
                }
                else {
                    this.optionsContainer.down('button[answerNo=' + target.config.answerNo + ']').setUi('decline');
                    this.careersListController.career.data.current_attempts--;
                    this.careersListController.career.save();
                    if(this.careersListController.career.data.current_attempts>0 ||this.careersListController.career.data.max_attempts==0 )
                    {
                        if(this.careersListController.career.data.max_attempts > 0)
                        {
                            attempts_html = '<br /><p><text style="color:red">' + '❤</text> x ' +                 this.careersListController.career.data.current_attempts +"<br />";
                        }
                        Ext.Msg.alert(i18n.gettext('Wrong!'), this.activity.data.penalty+ '<br />' + attempts_html, function ()
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
            showSeconds: function ()
            {
             
                if (this.isStopped === false && this.loading === false) 
                {
                    this.currentTime--;
                    this.timeLabel.setHtml(i18n.translate("%d second", "%d seconds").fetch(parseInt(this.currentTime, 10)));
                    if (this.currentTime < 0) {
                        clearInterval(this.secondtemp);
                        this.showAnswers();
                    }
                }
            },
            skip: function ()
            {
                clearInterval(this.secondtemp);
                this.showAnswers();
				this.score = parseInt(((parseInt(this.currentTime,10)) * 50) / (parseInt(this.activity.data.time-1,10)+0))+50;
				if(this.score > 100)
				{
					this.score = 100;
				}
            },
            stop: function ()
            {
                clearInterval(this.secondtemp);
            },
            stopNotClear: function ()
            {
                this.isStopped = true;
            },
            restart: function ()
            {
                this.isStopped = false;
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
