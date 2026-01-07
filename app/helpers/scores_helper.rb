module ScoresHelper
  private

  def calculate_score
    (1000.0 - (Time.now.to_f - session[:game][:score][:start])).truncate(2)
  end
end
