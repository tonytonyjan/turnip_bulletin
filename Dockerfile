FROM ruby:2.7.1-alpine3.11
WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
RUN apk add --no-cache --virtual .build-deps make gcc g++ libc-dev postgresql-dev && \
  bundle install --jobs 4 && \
  apk del .build-deps
COPY package.json yarn.lock ./
RUN apk add --no-cache yarn && yarn install
RUN apk add --no-cache tzdata postgresql-libs
COPY . .
CMD ["bin/rails", "server", "-b", "0.0.0.0"]