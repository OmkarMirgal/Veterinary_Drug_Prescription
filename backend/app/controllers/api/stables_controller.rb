class Api::StablesController < ApplicationController
  before_action :ensure_valid_params_presence, only: [:create, :update]
  before_action :set_stable, only: %i[ show update destroy ]

  # GET /stables
  def index
    @stables = current_user.stables
    render json: @stables
  end

  # GET /stables/1
  def show
    render json: @stable
  end

  # POST /stables
  def create
    @stable = current_user.stables.build(stable_params)

    if @stable.save
      render json: @stable, status: :created
    else
      render json: { errors: @stable.errors.full_messages }, status: :unprocessable_entity,  location: @stable
    end
  end

  # PATCH/PUT /stables/1
  def update
    if @stable.update(stable_params)
      render json: @stable
    else
      render json: { errors: @stable.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /stables/1
  def destroy
    if @stable.destroy!
      head :no_content
    else
      render json: { error: 'Failed to delete stable' }, status: :unprocessable_entity
    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stable
      @stable = current_user.stables.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Stable not found' }, status: :not_found
    end

    # Only allow a list of trusted parameters through.
    def stable_params
      params.require(:stable).permit(:name, :location, :owner)
    end
    
    def ensure_valid_params_presence
      unless params[:stable].present? && params[:stable].is_a?(ActionController::Parameters)
        render json: { error: 'Request body must be wrapped with "stable": {}' }, status: :bad_request
      end
    end
  
end
