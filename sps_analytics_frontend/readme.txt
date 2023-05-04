--------------------
INSTALLATION
--------------------
Kræver sps-analytics, i en tilpasset version, der også logger:
	- username: brugeren unikke id. Hvis ikke man har denne parameter må man undvære de sql commands, der bruger denne, og de tilhørede pages. Kræver også en tilretning i js, så de manglende pages ikke kaldes.
	- state: load-tilstanden som LOAD_ENDED, LOAD_UPDATE, LOAD_ERROR. Hvis ikke man har denne parameter kan den fjernes i SQL-commands (se længere nede), og så bør det fungere uden.



1. i sps-analytics modulet tilføj pages:

	<page name="sps_analytics.get_top_profile_for_theme">

        <url-parameters>
            <url-parameter name="themename">
                if isDefined(themename) then themename
                else "" endif
            </url-parameter>
            <url-parameter name="site">
                if isDefined(site) then site
                else "" endif
            </url-parameter>
            <url-parameter name="profile">
                if isDefined(profile) then profile
                else "" endif
            </url-parameter>
            <url-parameter name="date">
                if isDefined(date) then date
                else "" endif
            </url-parameter>
        </url-parameters>

        <data handler="datasource" operation="execute-command">
            <url-parameters>
                <url-parameter name="datasource" value="sps_analytics"/>
                <url-parameter name="command" value="get-top-profile-for-theme"/>
            </url-parameters>
        </data>
    </page>
	<page name="sps_analytics.get_user_count_total">

        <url-parameters>
            <url-parameter name="themename">
                if isDefined(themename) then themename
                else "" endif
            </url-parameter>
            <url-parameter name="site">
                if isDefined(site) then site
                else "" endif
            </url-parameter>
            <url-parameter name="date">
                if isDefined(date) then date
                else "" endif
            </url-parameter>
        </url-parameters>

        <data handler="datasource" operation="execute-command">
            <url-parameters>
                <url-parameter name="datasource" value="sps_analytics"/>
                <url-parameter name="command" value="get-user-count-total"/>
            </url-parameters>
        </data>
    </page>
	<page name="sps_analytics.get_user_count">

        <url-parameters>
            <url-parameter name="themename">
                if isDefined(themename) then themename
                else "" endif
            </url-parameter>
            <url-parameter name="site">
                if isDefined(site) then site
                else "" endif
            </url-parameter>
            <url-parameter name="profile">
                if isDefined(profile) then profile
                else "" endif
            </url-parameter>
            <url-parameter name="date">
                if isDefined(date) then date
                else "" endif
            </url-parameter>
        </url-parameters>

        <data handler="datasource" operation="execute-command">
            <url-parameters>
                <url-parameter name="datasource" value="sps_analytics"/>
                <url-parameter name="command" value="get-user-count"/>
            </url-parameters>
        </data>
    </page>
	<page name="sps_analytics.get_theme_count">

        <url-parameters>
            <url-parameter name="themename">
                if isDefined(themename) then themename
                else "" endif
            </url-parameter>
            <url-parameter name="site">
                if isDefined(site) then site
                else "" endif
            </url-parameter>
            <url-parameter name="profile">
                if isDefined(profile) then profile
                else "" endif
            </url-parameter>
            <url-parameter name="date">
                if isDefined(date) then date
                else "" endif
            </url-parameter>
        </url-parameters>

        <data handler="datasource" operation="execute-command">
            <url-parameters>
                <url-parameter name="datasource" value="sps_analytics"/>
                <url-parameter name="command" value="get-theme-interactions-count"/>
            </url-parameters>
        </data>
    </page>
	<page name="sps_analytics.get_theme_count_total">

        <url-parameters>
            <url-parameter name="themename">
                if isDefined(themename) then themename
                else "" endif
            </url-parameter>
            <url-parameter name="site">
                if isDefined(site) then site
                else "" endif
            </url-parameter>
            <url-parameter name="date">
                if isDefined(date) then date
                else "" endif
            </url-parameter>
        </url-parameters>

        <data handler="datasource" operation="execute-command">
            <url-parameters>
                <url-parameter name="datasource" value="sps_analytics"/>
                <url-parameter name="command" value="get-theme-interactions-count-total"/>
            </url-parameters>
        </data>
    </page>

2. i sps-analytics modulet tilføj datasource sql commands:
		<sql command="get-theme-interactions-count">
			select count(*) from sps_analytics.themes_interactions where state&lt;>'LOAD_UPDATE' and profile=[string: profile] and site=[string: site] and themefile_name=[string: themename] and LEFT(convert(varchar, time,20),10)>=[string: date]
		</sql>
		<sql command="get-theme-interactions-count-total">
			select count(*) from sps_analytics.themes_interactions where state&lt;>'LOAD_UPDATE' and site=[string: site] and themefile_name=[string: themename] and LEFT(convert(varchar, time,20),10)>=[string: date]
		</sql>
		<sql command="get-user-count">
			select count(*) from (select distinct username from sps_analytics.themes_interactions where state&lt;>'LOAD_UPDATE' and profile=[string: profile] and site=[string: site] and themefile_name=[string: themename] and LEFT(convert(varchar, time,20),10)>=[string: date]) temp
		</sql>
		<sql command="get-user-count-total">
			select count(*) from (select distinct username from sps_analytics.themes_interactions where state&lt;>'LOAD_UPDATE' and site=[string: site] and themefile_name=[string: themename] and LEFT(convert(varchar, time,20),10)>=[string: date]) temp
		</sql>
		<sql command="get-top-profile-for-theme">
			select top 1 count(*), profile, themefile_name from sps_analytics.themes_interactions where state&lt;>'LOAD_UPDATE' and site=[string: site] and themefile_name=[string: themename] and LEFT(convert(varchar, time,20),10)>=[string: date] group by profile,themefile_name order by count(*) desc
		</sql>

3. Tilføj modul i modulfil
    <module name="sps_analytics_frontend" dir="custom/sps_analytics_frontend" permissionlevel="authorized" />

4. sæt restriktion på modulet i permission manager, så det er tilgængeligt for udvalgte admins

5. Tilføj tool-knap i profil (sammen med de andre værktøjsknapper, såsom i-knap, E-knap, COWI gadefoto mv.)
    <tool ignore="not ModuleDefined('sps_analytics_frontend')" module="sps_analytics_frontend" name="SPS_analytics_button"/>
