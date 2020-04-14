# frozen_string_literal: true

require 'expiration_calculator'

class PriceRecordsController < ApplicationController
  skip_before_action :verify_authenticity_token # TODO: this is workaround

  def index
    params.permit(friends: %i[island resident])
    price_records =
      PriceRecord
      .search_by_friends_order_by_price(
        Array(params[:friends]).map { |friend| PriceRecord::Friend.new(friend[:island], friend[:resident]) }
      ).limit(50).to_a
    price_records.map! do |price_record|
      {
        id: price_record.id,
        island: price_record.island,
        resident: price_record.resident,
        price: price_record.price,
        expiration: price_record.expiration.utc,
        updated_at: price_record.updated_at
      }
    end
    render json: price_records
  end

  def create
    now = Time.now
    if (price_record = PriceRecord.find_by(
      **price_record_params.except(:price),
      updated_at: ExpirationCalculator.interval(now.localtime(price_record_params[:timezone]))
    ))
      price_record.price = price_record_params[:price]
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
      .permit(:island, :resident, :price, :timezone)
      .tap do |i|
        i.require(%i[island resident price timezone])
      end
  end
end
