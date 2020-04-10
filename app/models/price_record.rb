# frozen_string_literal: true

class PriceRecord < ApplicationRecord
  SECONDS_10_HOURS = 36_000
  Friend = Struct.new(:island, :resident)

  def self.search_by_friends_order_by_price(friends, now: Time.now)
    where(
      Arel::Nodes::In.new(
        Arel::Nodes::Grouping.new(
          [
            PriceRecord.arel_table[:island],
            PriceRecord.arel_table[:resident]
          ]
        ),
        friends.map do |friend|
          Arel::Nodes::Grouping.new(
            [
              Arel::Nodes.build_quoted(friend.island),
              Arel::Nodes.build_quoted(friend.resident)
            ]
          )
        end
      )
    )
      .where('created_at > ?', now - SECONDS_10_HOURS)
      .order(price: :desc)
  end

  def expired?(now: Time.now)
    time_with_zone = created_at.localtime(timezone)
    case time_with_zone.hour
    when 8...12 then now >= Time.new(time_with_zone.year, time_with_zone.month, time_with_zone.day, 12, 0, 0, timezone)
    when 12...22 then now >= Time.new(time_with_zone.year, time_with_zone.month, time_with_zone.day, 22, 0, 0, timezone)
    else false
    end
  end
end
