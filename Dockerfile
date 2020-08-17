FROM gutek9/docker-nginx-upload-module
COPY docker_nginx/conf/default.conf /etc/nginx/conf.d/ 
COPY docker_nginx/nginxconf/nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
EXPOSE 80
