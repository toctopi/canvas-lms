class MisconceptionsController < ApplicationController
	before_filter :require_context

  def new
    quiz = Quiz.find(params[:quiz_id])
    misconception = quiz.misconceptions.create!(:quiz_id => quiz.id, :name => "Untitled", :pattern => {}, :paths => {}, :workflow_state => "available")

    redirect_to :back
  end

  def create
  end

  def update
    @misconception = Misconception.find(params[:id])
    if @misconception.update_attributes(params[:quiz_misconception])
      @misconception.reload
      render :json => @misconception.to_json
    else
      render :json => @misconception.errors.to_json, :status => :bad_request
    end
  end

  def index
    @abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    add_crumb("Misconceptions")
  	@misconceptions = Quiz.find(params[:quiz_id]).misconceptions
  end

  def show
  end

end
