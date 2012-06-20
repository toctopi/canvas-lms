class MisconceptionsController < ApplicationController
	before_filter :require_context

  def new
  end

  def create
  end

  def index
  	@misconceptions = Quiz.find(params[:quiz_id]).misconceptions
  end

  def show
  end

end
