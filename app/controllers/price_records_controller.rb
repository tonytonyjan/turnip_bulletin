# frozen_string_literal: true

class PriceRecordsController < ApplicationController
  def index
    params.permit(friends: %i[island resident])
    price_records =
      PriceRecord
      .search_by_friends_order_by_price(
        params[:friends].map { |friend| PriceRecord::Friend.new(friend[:island], friend[:resident]) }
      ).to_a
    price_records.select! do |price_record|
      time_with_zone = price_record.created_at.localtime(price_record.timezone)
      case time_with_zone.hour
      when 8...12 then Time.now < Time.new(time_with_zone.year, time_with_zone.month, time_with_zone.day, 12, 0, 0, price_record.timezone)
      when 12...22 then Time.now < Time.new(time_with_zone.year, time_with_zone.month, time_with_zone.day, 22, 0, 0, price_record.timezone)
      end
    end
    price_records.map! do |price_record|
      price_record.attributes.slice('id', 'island', 'resident', 'price', 'created_at')
    end
    render json: price_records
  end

  def create
    price_record = PriceRecord.new(params.require(:price_record).permit(:island, :resident, :price, :timezone))

    if price_record.save
      render json: nil, status: :created
    else
      render json: price_record.errors, status: :unprocessable_entity
    end
  end
end
