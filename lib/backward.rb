# frozen_string_literal: true

module Backward
  extend self

  def with_timezone_offset(time, timezone)
    if timezone_old_form?(timezone)
      time.localtime(timezone)
    else
      time.in_time_zone(timezone).to_time
    end
  end

  def timezone_old_form?(timezone)
    timezone.start_with?(/[+-]/)
  end
end
