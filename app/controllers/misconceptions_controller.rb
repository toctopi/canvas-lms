class MisconceptionsController < ApplicationController
	before_filter :require_context

  def new
    quiz = Quiz.find(params[:quiz_id])
    misconception = quiz.misconceptions.create!(:quiz_id => quiz.id, :name => "Untitled", :pattern => [], :paths => [], :workflow_state => "available")

    redirect_to :back
  end

  def create
  end

  def index
    add_crumb("Misconceptions")
  	@misconceptions = Quiz.find(params[:quiz_id]).misconceptions
  end

  def show
  end

end
