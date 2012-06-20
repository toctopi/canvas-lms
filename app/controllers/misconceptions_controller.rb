class MisconceptionsController < ApplicationController
	before_filter :require_context

  def new
  end

  def create
  end

  def index
  	debugger
  	@misconceptions = @context.misconceptions
  end

  def show
  end

end
