class FindablesController < ApplicationController
  def show
    return render json: nil unless in_game?

    map_id, name, x, y = character_params.values_at(:map_id, :name, :x, :y)

    coordinate = Coordinate.find_by_coordinates(map_id, x.to_f, y.to_f)
    findable = coordinate&.findable

    if findable && findable.name.downcase == name.downcase
      session[:game][:findables][:found] += 1
      render json: findable
    else
      render json: nil
    end
  end

  private

  def character_params
    params.permit(:map_id, :name, :x, :y)
  end
end
