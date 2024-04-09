#!/bin/sh
#===========================================================================================
# JVM Configuration
#===========================================================================================
#JAVA_OPT="${JAVA_OPT} -server -Xms${JVM_XMS} -Xmx${JVM_XMX} -Xmn${JVM_XMN} -XX:MetaspaceSize=${JVM_MS} -XX:MaxMetaspaceSize=${JVM_MMS}"
if [ "${HUSSAR_DEBUG}" = "y" ]; then
  JAVA_OPT="${JAVA_OPT} -Xdebug -Xrunjdwp:transport=dt_socket,address=12345,server=y,suspend=n"
fi
JAVA_OPT="${JAVA_OPT} -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${BASE_DIR}/logs/java_heapdump.hprof"
JAVA_OPT="${JAVA_OPT} -XX:-UseLargePages"


JAVA_OPT="${JAVA_OPT} -Xloggc:${BASE_DIR}/logs/hussar_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M"

JAVA_OPT="${JAVA_OPT} -Dfile.encoding=utf-8"
JAVA_OPT="${JAVA_OPT} -Djava.security.egd=file:/dev/./urandom"
JAVA_OPT="${JAVA_OPT} -jar ${BASE_DIR}/app.jar -Dspring.config.location=${BASE_DIR}/config/application.yml,${BASE_DIR}/config/application-dev.yml"

cp -a ${BASE_DIR}/init/hussar-web ${BASE_DIR}/workspace/

echo "This app is starting, you can docker logs your container"


exec  $JAVA ${JAVA_OPT}
