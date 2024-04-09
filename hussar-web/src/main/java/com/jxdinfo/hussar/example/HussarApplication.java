/*
 * 轻骑兵低代码开发平台
 * HussarApplication.java
 * 版权所有：金现代信息产业股份有限公司  Copyright (c) 2018-2023 .
 * 金现代信息产业股份有限公司保留所有权利,未经允许不得以任何形式使用.
 */
package com.jxdinfo.hussar.example;

import com.jxdinfo.hussar.core.launch.HussarBaseApplication;
import com.jxdinfo.hussar.core.web.HussarWebApplicationServletInitializer;
import com.jxdinfo.hussar.support.transaction.annotation.EnableHussarTransactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;



/*
 *  SpringBoot方式启动类
 *  当前包结构为: com.jxdinfo.hussar.example
 *  项目开发过程添加自定义包结构方式参考：
 *
 *  @SpringBootApplication( scanBasePackages = {"com.jxdinfo.hussar.modulename","com.xxx.xxx.xxx" })
 *  @MapperScan(basePackages = {"com.jxdinfo.hussar.modulename.**.dao","com.xxx.xx.**.dao" })
 *
 *  平台相关包已经基于自动装配进行了封装，
 *  禁止直接对：com、com.jxdinfo、com.jxdinfo.hussar 等包进行全包扫描，
 *  全包扫描可能会导致同名类扫描冲突等问题
 *
 *  微服务版启动增加如下注解
 *
 *   @EnableHussarFeignClients
 *   @EnableDiscoveryClient
 *   @EnableCircuitBreaker
 */

@EnableCaching
@SpringBootApplication
@EnableHussarTransactional
public class HussarApplication extends HussarWebApplicationServletInitializer {

	protected static final Logger logger = LoggerFactory.getLogger(HussarApplication.class);

	/**
	 * 解决tomcat打包问题<br>
	 * 该方法返回值，启动类类名，main中方法HussarBaseApplication.run中的参数，三个类必须是一个
	 */
	@Override
	protected Class<?> mainApplicationClass() {
		return HussarApplication.class;
	}

	public static void main(String[] args) {
		HussarBaseApplication.run(HussarApplication.class, args);
		logger.info("HussarApplication is success!");
	}
}
