class Api::UsersController < ApplicationController
    before_action :authenticate_user, except: [:signup, :login]
    before_action :set_user, only: [:destroy]
  
    def signup
            user = User.new(user_params)
        if user.save
            render json: { message: 'User created successfully' }, status: :created
        else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    def login
        if params[:user].blank?
            render json: { error: 'Missing user parameters' }, status: :unprocessable_entity
            return
        end
        
        if params[:user][:email].blank?
            render json: { error: 'Email is required' }, status: :unprocessable_entity
            return
        end
        
        if params[:user][:password].blank?
            render json: { error: 'Password is required' }, status: :unprocessable_entity
            return
        end
        
        unless params[:user][:email] =~ URI::MailTo::EMAIL_REGEXP
            render json: { error: 'Invalid email format' }, status: :unprocessable_entity
            return
        end
        
        user = User.find_by(email: user_login_params[:email])
        if user&.authenticate(user_login_params[:password])
            token = generateBasicAuthToken(user_login_params[:email], user_login_params[:password])
            response.headers['Authorization'] = token
            render json: { token: token, message: "Logged in successfully" }, status: :ok
        else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
    end

    def logout
        auth_header = request.headers['Authorization']
        if auth_header.present?
            user = decodeAuthToken(auth_header)
            if user
                response.headers['Authorization'] = nil
                render json: { message: 'Logged out successfully' }, status: :ok
            else
                render json: { error: 'Invalid token' }, status: :unauthorized
            end
        else
            render json: { error: 'Missing Authorization header' }, status: :unauthorized
        end
    end

    # DELETE /stables/1
    def destroy
        @user.destroy
        render json: { message: 'User deleted successfully' }, status: :ok
      end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :licence)
    end

    def user_login_params
        params.require(:user).permit(:email, :password )
    end

    def set_user
        @user = User.find(params[:id])
        rescue ActiveRecord::RecordNotFound
            render json: { error: 'User not found' }, status: :not_found
      end
end