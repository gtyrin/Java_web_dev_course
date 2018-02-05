package org.ytsiuryn.fcrew.web.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.ytsiuryn.fcrew.FCrewApplication;

import javax.servlet.http.HttpServletRequest;

/**
 * Общий контроллер обработки адресов приложения.
 */
@Controller
public class HomeController {

	@RequestMapping("/admin")
	public String admin(){
		return "admin";
	}

	@RequestMapping("/dispatcher")
	public String dispatcher(){
		return "dispatcher";
	}

	@RequestMapping(value = {"/", "/login"})
	public String loginPage(Model model, HttpServletRequest request) {
//		System.out.println("role: " + request.getRemoteUser());
//		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//		System.out.println(auth.getAuthorities());
//		if (auth.isAuthenticated()) {
//			FCrewApplication.getLogger().info("'" + auth.getName() + "' has logged in.");
//		}
		if(request.isUserInRole("ADMIN")) {
			FCrewApplication.getLogger().info("Admin has opened the session.");
			return "admin";
		} else if(request.isUserInRole("DISPATCHER")) {
			FCrewApplication.getLogger().info("Dispatcher has opened the session.");
			return "dispatcher";
		} else {
			return "login";
		}
	}

	@RequestMapping(value="/403")
	public String Error403(){
		return "403";
	}
}