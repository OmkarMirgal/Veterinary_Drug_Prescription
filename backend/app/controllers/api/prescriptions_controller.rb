class Api::PrescriptionsController < ApplicationController
  before_action :ensure_valid_params_presence, only: [:create, :update]
  before_action :set_prescription, only: %i[ show update destroy ]

  # GET /prescriptions
  def index
    @prescriptions = current_user.prescriptions
    render json: @prescriptions
  end

  # GET /prescriptions/1
  def show
    render json: @prescription
  end

  # POST /prescriptions
  def create
    @stable = current_user.stables.find(params[:prescription][:stable_id])
    @prescription = current_user.prescriptions.build(prescription_params)
    @prescription.stable = @stable

    if @prescription.save
      render json: @prescription, status: :created, location: @prescription
    else
      render json: { errors: @prescription.errors.full_messages }, status: :unprocessable_entity
    end
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Stable not found' }, status: :unprocessable_entity
  end

  # PATCH/PUT /prescriptions/1
  def update
    if @prescription.update(prescription_params)
      render json: @prescription
    else
      render json: { errors: @prescription.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /prescriptions/1
  def destroy
    if @prescription.destroy!
      head :no_content
    else
      render json: {error: 'Failed to delete prescription'}, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_prescription
      @prescription = current_user.prescriptions.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prescription not found' }, status: :not_found
    end

    # Only allow a list of trusted parameters through.
    def prescription_params
      params.require(:prescription).permit(:indication, :diagnosisDetails, :application, :amount, :amountUnit, :dosage, :applicationDate, :applicationDuration, :usageDuration, :usageInstructions, :stable_id)
    end

    def ensure_valid_params_presence
      unless params[:prescription].present? && params[:prescription].is_a?(ActionController::Parameters)
        render json: { error: 'Request body must be wrapped with "prescription": {}' }, status: :bad_request
      end
    end
end
