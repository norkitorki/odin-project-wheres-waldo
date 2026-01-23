module GameSessionsHelper
  private

  def reset_game_session
    return unless @map

    session[:game] = {
      map: @map,
      findables: { count: @findables&.length || @map.findables.count, found: 0 },
      score: { start: Time.now.to_f }
    }
  end
end
