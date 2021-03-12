FROM nginx:1.17-alpine

ARG DIST_ROOT=./dist
ARG APP_ROOT=/usr/share/nginx/html
WORKDIR ${APP_ROOT}
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk update \
    && apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
ADD ${DIST_ROOT} .
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]