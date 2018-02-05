package org.ytsiuryn.fcrew;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.LocaleResolver;
//import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.ytsiuryn.fcrew.model.validators.*;

import java.util.Locale;
import java.util.ResourceBundle;

@SpringBootApplication
public class FCrewApplication extends RepositoryRestConfigurerAdapter implements ApplicationRunner {

	private static final Logger logger = LogManager.getLogger(FCrewApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(FCrewApplication.class, args);
	}

	@Override
	public void run(ApplicationArguments applicationArguments) throws Exception {
		logger.info("Session has started.");
	}

	/**
	 * Регистрация валидаторов.
	 * @param v
	 */
	@Override
	public void configureValidatingRepositoryEventListener(
			ValidatingRepositoryEventListener v) {
		v.addValidator("beforeCreate", new AirportValidator());
		v.addValidator("beforeCreate", new CrewManValidator());
		v.addValidator("beforeCreate", new CrewSpecValidator());
		v.addValidator("beforeCreate", new FlightValidator());
		v.addValidator("beforeCreate", new OperatorValidator());
		v.addValidator("beforeCreate", new PlaneValidator());
		v.addValidator("beforeCreate", new PlaneModelValidator());
	}

	public static Logger getLogger() {
		return logger;
	}

	/**
	 * Определение источника для локализованных сообщений.
	 * @return
	 */
	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasename("classpath:messages");
		messageSource.setDefaultEncoding("UTF-8");
		return messageSource;
	}

	/**
	 * Объект локализации сообщений.
	 * @return
	 */
	@Bean
	public LocalValidatorFactoryBean validator() {
		LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
		bean.setValidationMessageSource(messageSource());
		return bean;
	}

}
