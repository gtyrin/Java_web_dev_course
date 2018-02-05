package org.ytsiuryn.fcrew.config;


import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableAutoConfiguration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	DataSource dataSource;

	/**
	 * Определение данных для сверки параметров аутентификации и авторизации.
	 */
	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication().dataSource(dataSource)
				.usersByUsernameQuery("select username,password, enabled from user_roles where username=? and is_archive=0")
				.authoritiesByUsernameQuery("select username, role from user_roles where username=? and is_archive=0");
	}

	/**
	 * Определение доступа к ресурсам зарегистрированным пользователям.
	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.authorizeRequests()
				.antMatchers("/api").access("hasRole('ADMIN') or hasRole('DISPATCHER')")
				.anyRequest().authenticated()
				.and()
				.formLogin().loginPage("/login").permitAll()
				.and()
				.logout().permitAll();
		http.csrf().disable();
		http.exceptionHandling().accessDeniedPage("/403");
	}

}