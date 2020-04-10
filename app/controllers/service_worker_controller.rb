# frozen_string_literal: true

class ServiceWorkerController < ApplicationController
  skip_before_action :verify_authenticity_token
  def service_worker; end
end
