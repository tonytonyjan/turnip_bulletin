# frozen_string_literal: true

namespace :vapid do
  desc 'Generate VAPID public and private keys'
  task :keys do
    require 'openssl'
    require 'base64'
    ec = OpenSSL::PKey::EC.generate('prime256v1')
    puts(
      Base64.urlsafe_encode64(ec.public_key.to_bn.to_s(2), padding: false),
      Base64.urlsafe_encode64(ec.private_key.to_s(2), padding: false)
    )
  end
end
