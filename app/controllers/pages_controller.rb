class PagesController < ApplicationController
  def home
  end

  def app
    render layout: false
  end
end
