FROM node:15.2.1-alpine3.10 as build
WORKDIR /frontend
COPY . /frontend/
ARG REACT_APP_STRIPE_ID
ARG REACT_APP_API_HOST
ENV REACT_APP_STRIPE_ID $REACT_APP_STRIPE_ID
ENV REACT_APP_API_HOST $REACT_APP_API_HOST
RUN npm install 
RUN npm run-script build

FROM nginx:alpine
COPY --from=build /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY webserver/nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
