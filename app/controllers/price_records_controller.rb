# frozen_string_literal: true

require 'expiration_calculator'

class PriceRecordsController < ApplicationController
  SECONDS_10_HOURS = 36_000

  skip_before_action :verify_authenticity_token # TODO: this is workaround

  def index
    permitted_params = params.permit(:since, friends: %i[island resident])
    price_records =
      PriceRecord
      .search_by_friends_order_by_price(
        Array(permitted_params[:friends]).map { |friend| PriceRecord::Friend.new(friend[:island], friend[:resident]) }
      ).where('updated_at > ?', permitted_params[:since] || (Time.now - SECONDS_10_HOURS))
      .order(price: :desc)
      .limit(50)
      .to_a.map! do |price_record|
        {
          id: price_record.id,
          island: price_record.island,
          resident: price_record.resident,
          price: price_record.price,
          text: price_record.text,
          expiration: price_record.expiration.utc,
          updated_at: price_record.updated_at
        }
      end
    render json: price_records
  end

  def create
    now = Time.now
    if (price_record = PriceRecord.find_by(
      **price_record_params.except(:price, :text),
      updated_at: ExpirationCalculator.interval(now.localtime(price_record_params[:timezone]))
    ))
      price_record.attributes = price_record_params.permit(:price, :text)
    else
      price_record = PriceRecord.new(**price_record_params, created_at: now)
    end
    if price_record.save
      render json: nil, status: :created
    else
      render json: price_record.errors, status: :unprocessable_entity
    end
  end

  private

  def price_record_params
    params
      .require(:price_record)
      .permit(:island, :resident, :price, :timezone, :text)
      .tap do |i|
        i.require(%i[island resident price timezone])
      end
  end
end
