/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace console
*/ 

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.view.LevelDetail', {
            extend: 'Ext.Panel',
            xtype: 'leveldetail',
            requires: [
                'DrGlearning.view.LevelDescription'
            ],
            config: {
                layout: 'vbox',
                defaults: {
                    flex: 1
                },
                items: 
                [
                    {
                        ui: 'activities',
                        xtype: 'list',
                        customId: 'activitiesList',
                        store: 'Activities',
                        cls: 'activities-list',
                        disableSelection: true,
                        itemTpl: new Ext.XTemplate(
                        '<tpl for=".">',
                            '<tpl if= "score &gt;= 50 && score &lt; 70">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score"><text style="color:#D4A017">$</text> x {score}, '+i18n.gettext('Not bad!')+'</div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                            '<tpl if= "score &gt;= 70 && score &lt; 80">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score"><text style="color:#D4A017">$</text> x {score}, '+ i18n.gettext('You can do better') + '</div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                            '<tpl if= "score &gt;= 80 && score &lt; 90">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score"><text style="color:#D4A017">$</text> x {score}, '+ i18n.gettext('Nice job!') + ' </div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                           '<tpl if= "score &gt;= 90 && score &lt; 100">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score"><text style="color:#D4A017">$</text> x {score}, '+ i18n.gettext('Almost the max!') + '</div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                           '<tpl if= "score == 100">',
                                '<div class = "itemlist">',
                                        '<b>{name}</b><img class="tick" height=20 src=resources/images/tick.png><div class = "score"><text style="color:#D4A017">$</text> x {score}, '+ i18n.gettext('Max, congrats!') + ' </div>',
                                        '<div><font size="3" color="grey">{query} </font><div>',
                                '</div>',
                            '</tpl>',
                            '<tpl if= "successful == false">',
                                '<div class = "itemlist">',
                                        '<div><b>{name}</b></div>',
                                        '<font size="3" color="grey">{query} </font>',
                                '</div>',
                            '</tpl>',
                        '</tpl>'
                    )
                    }   
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
