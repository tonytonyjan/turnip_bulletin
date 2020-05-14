# Development

**Rails:**

```sh
docker-compose up web
```

**Storybook:**

```
docker-compose up storybook
```

**SSL:**

```sh
export RAILS_BIND=ssl://0.0.0.0:3000?key=dev.local-key.pem&cert=dev.local.pem
export RAILS_HOSTS=dev.local
docker-compose up
```

You probably want to use [mkcert](https://github.com/FiloSottile/mkcert) and then [import mkcert's root certification to your smart phone](https://support.google.com/pixelphone/answer/2844832?hl=en&visit_id=637221873894545426-2706422605&rd=1).
