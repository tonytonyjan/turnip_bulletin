# frozen_string_literal: true

require 'expiration_calculator'

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
      .where('updated_at > ?', now - SECONDS_10_HOURS)
      .order(price: :desc)
  end

  def expiration
    ExpirationCalculator.end(updated_at.localtime(timezone))
  end

  def expired?(now: Time.now)
    now >= expiration
  end
end
