class PagesController < ApplicationController
  layout 'page'

  def app
    render layout: false
  end
end
