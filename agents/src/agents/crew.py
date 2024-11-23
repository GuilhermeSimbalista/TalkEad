from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

# Uncomment the following line to use an example of a custom tool
# from agents.tools.custom_tool import MyCustomTool

# Check our tools documentations for more information on how to use them
# from crewai_tools import SerperDevTool

@CrewBase
class AgentsCrew():
	"""Agents crew"""
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent
	def tutor(self) -> Agent:
		return Agent(
			config=self.agents_config['tutor'],
			verbose=True
		)

	@task
	def responder_duvidas(self) -> Task:
		return Task(
			config=self.tasks_config['responder_duvidas'],
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the Agents crew"""
		return Crew(
			agents=self.agents,
			tasks=self.tasks,
			process=Process.sequential,
			verbose=True
		)