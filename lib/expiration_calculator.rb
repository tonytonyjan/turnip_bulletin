# frozen_string_literal: true

require 'time'

module ExpirationCalculator
  extend self

  def interval(time)
    self.begin(time)...self.end(time)
  end

  def begin(time)
    time.hour < 12 ? set_hour(time, 8) : set_hour(time, 12)
  end

  def end(time)
    time.hour < 12 ? set_hour(time, 12) : set_hour(time, 22)
  end

  private

  def set_hour(time, hour)
    Time.new(time.year, time.month, time.day, hour, 0, 0, time.iso8601[-6, 6])
  end
end
