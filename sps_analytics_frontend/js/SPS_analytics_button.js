var spsAnalyticsFrontend = {
			init: function() {
				document.getElementById('SPS_analytics_button').setAttribute('option',((document.getElementById('SPS_analytics_button').getAttribute('option')=='false') || (document.getElementById('SPS_analytics_button').getAttribute('option')==null)));
				document.getElementById('SPS_analytics_button').getElementsByTagName('a')[0].getElementsByTagName('img')[0].setAttribute('src',(document.getElementById('SPS_analytics_button').getAttribute('option')=='true' ? '/skins/esbjerg_intern/images/modules/sps_analytics_frontend/A.png?ver=4.4.0-up1bfe_revert' : '/skins/esbjerg_intern/images/modules/sps_analytics_frontend/not_A.png?ver=4.4.0-up1bfe_revert'));
				document.getElementById('SPS_analytics_button').getElementsByTagName('a')[0].getElementsByTagName('img')[0].setAttribute('alt',(document.getElementById('SPS_analytics_button').getAttribute('option')=='true' ? 'SPS-Analytics On' : 'SPS-Analytics Off'));
			}

		}
		
var today = new Date();
		stopdate = new Date(today.setDate(today.getDate() -7));
		
		
		function writeCount(data_name,themename,i,count){
			container = document.getElementById('themegroup-' + data_name + '_tgcontainer');
			themes = container.getElementsByClassName('theme small');
			for (let j=0;j<themes.length;j++){
				if (themes[j].getAttribute('themename')==themename){
					theme = themes[j];
					break;
				}
			}
			placeholder = count.slice(0,count.indexOf(':')) + ': LOADING]';
			theme_metadata = theme.getElementsByTagName('span')[0].innerHTML;
			theme_metadata = theme_metadata.replace(placeholder,count);
			theme.getElementsByTagName('span')[0].innerHTML = theme_metadata;
			
		}		
		
        var themeListener = spm.addListener('THEMEGROUP_EXPANSION_STATE_CHANGED', function(eventname, data, state) {
			const data_name = JSON.parse(JSON.stringify(data['name']));
			themes = document.getElementsByClassName('theme small');
			for (i=0;i<themes.length;i++){
				const k = JSON.parse(JSON.stringify(i));
				theme = themes[i];
				theme_metadata = themes[i].getElementsByTagName('span')[0].innerHTML;
				if ((theme_metadata.includes('SPS-Analytics')==false) && (document.getElementById('SPS_analytics_button').getAttribute('option')=='true')) {
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + '<br><b>-----------------------------------<br>SPS-Analytics (7 dage):<br>-----------------------------------</b>'
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + ' <br><b>[Top1 profil: LOADING]</b>';
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + ' <br><b>[Visninger, profil: LOADING]</b>';
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + ' <br><b>[Visninger, total: LOADING]</b>';
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + ' <br><b>[Brugere, profil: LOADING]</b>';
					themes[i].getElementsByTagName('span')[0].innerHTML = themes[i].getElementsByTagName('span')[0].innerHTML + ' <br><b>[Brugere, total: LOADING]</b>';
					const themename = JSON.parse(JSON.stringify(theme.getAttribute("themename")));
					
					//visninger, profil
					var req = spm.getSession().createPageRequest('sps_analytics.get_theme_count');
					req.call({
						'date': stopdate.toISOString().slice(0,10),
						'themename': themename,
						'site': document.location.host,
						'profile': spm.getProfile()
						}, function(response) {writeCount(data_name,themename,k,'[Visninger, profil: ' + response.row[0].row[0].value + ']')
					});
					
					//visninger, total
					var req = spm.getSession().createPageRequest('sps_analytics.get_theme_count_total');
					req.call({
						'date': stopdate.toISOString().slice(0,10),
						'themename': themename,
						'site': document.location.host,
						'profile': spm.getProfile()
						}, function(response) {writeCount(data_name,themename,k,'[Visninger, total: ' + response.row[0].row[0].value + ']')
					});
					
					//brugere, profil
					var req = spm.getSession().createPageRequest('sps_analytics.get_user_count');
					req.call({
						'date': stopdate.toISOString().slice(0,10),
						'themename': themename,
						'site': document.location.host,
						'profile': spm.getProfile()
						}, function(response) {writeCount(data_name,themename,k,'[Brugere, profil: ' + response.row[0].row[0].value + ']')
					});
					
					//brugere, total
					var req = spm.getSession().createPageRequest('sps_analytics.get_user_count_total');
					req.call({
						'date': stopdate.toISOString().slice(0,10),
						'themename': themename,
						'site': document.location.host,
						'profile': spm.getProfile()
						}, function(response) {writeCount(data_name,themename,k,'[Brugere, total: ' + response.row[0].row[0].value + ']')
					});
					
					//top 1 profil for tema 
					var req = spm.getSession().createPageRequest('sps_analytics.get_top_profile_for_theme');
					req.call({
						'date': stopdate.toISOString().slice(0,10),
						'themename': themename,
						'site': document.location.host,
						'profile': spm.getProfile()
						}, function(response) {if (response.row[0].row){writeCount(data_name,themename,k,'[Top1 profil: ' + response.row[0].row[0].profile + ' (' + response.row[0].row[0].value + ')]')} else {writeCount(data_name,themename,k,'[Top1 profil: ingen]')}
					});
					
				}
				
				
			}
			
		
            
        })