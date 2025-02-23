Hier ist die AIArchitecture.md-Datei für dein C++-Spiel in Unreal Engine 5:

# AI Architecture for LifeVerse Game

## 1. Introduction
This document outlines the architecture for the Artificial Intelligence (AI) system in LifeVerse, developed using Unreal Engine 5 (UE5). The goal is to create dynamic, responsive, and immersive AI behaviors that enhance gameplay, drive player interaction, and provide challenges. This includes NPC behavior, pathfinding, decision-making, and AI-driven events.

## 2. AI System Overview
The AI system in LifeVerse is designed to provide lifelike interactions with NPCs and dynamic environments. It is based on Unreal Engine's AI framework, leveraging tools like the Behavior Tree, AI Controllers, and Navigation Mesh (NavMesh).

### Key Components:
- **AI Controller**: The brain of the AI agent, controlling behavior and decision-making processes.
- **Behavior Trees**: A visual scripting system for creating complex, hierarchical AI behaviors.
- **Blackboards**: A data structure used to store and manage information related to the AI's state.
- **NavMesh**: A system that defines walkable areas and paths for AI navigation.
- **Sensing System**: The mechanism through which AI detects the player, objects, and other NPCs in the environment.
- **EQS (Environment Query System)**: A system that helps AI make decisions based on the environment, such as selecting the best cover or target.

## 3. AI Controller
The AI Controller is responsible for managing an AI character's logic and actions. It contains references to the Behavior Tree and Blackboard, allowing the AI to make decisions based on game states.

### Responsibilities:
- **Control Character Movement**: Direct the movement of the NPC character within the world using navigation.
- **Manage Behavior Trees**: Link to and control the execution of Behavior Trees.
- **Handle Decisions**: Make decisions such as attacking, patrolling, or interacting with the player.
- **Sensing and Awareness**: Process sensory inputs to detect threats or objects of interest.

Example:
```cpp
class ACustomAIController : public AAIController
{
    UPROPERTY(EditAnywhere)
    UBehaviorTree* AIBehaviorTree;

    UPROPERTY(EditAnywhere)
    UBlackboardData* AIBlackboard;

public:
    virtual void OnPossess(APawn* InPawn) override;
    virtual void BeginPlay() override;

private:
    void InitializeAI();
};

4. Behavior Tree

Behavior Trees allow AI to execute tasks in a hierarchical manner. Each node in the tree represents a different behavior or decision, such as moving to a location, performing an action, or changing the AI’s state.

Structure:
	•	Root: The starting point of the tree.
	•	Selector: Chooses between multiple child nodes based on conditions (e.g., chase if player is detected, patrol if idle).
	•	Sequence: Executes a sequence of actions in order (e.g., move to position, attack target).
	•	Decorators: Conditions that influence the flow of the tree (e.g., check if health is low, or if the player is visible).
	•	Services: Repeated tasks that occur during the execution of the tree (e.g., checking for enemies in range).

Example Behavior:
	•	Idle: AI waits for a player to enter the detection range.
	•	Patrol: AI follows a set path if the player is not nearby.
	•	Combat: AI actively engages in combat when the player is within range.

5. Blackboard

The Blackboard is a data structure used by the AI to store variables that affect behavior decisions. It is essential for communication between the Behavior Tree and the AI Controller.

Common Blackboard Keys:
	•	Target: The target the AI is currently focusing on (e.g., player, enemy).
	•	Health: The health of the AI, used to trigger defensive actions.
	•	Location: The current position of the AI or a specific target location.
	•	Alert Level: A value indicating how aware the AI is of the player’s presence.

Example of setting a key in the Blackboard:

BlackboardComp->SetValueAsVector(TEXT("TargetLocation"), TargetLocation);

6. Pathfinding and Navigation

AI pathfinding is achieved through Unreal’s Navigation Mesh (NavMesh), which defines walkable areas and obstacles. The AI can navigate these areas by querying the NavMesh to find the best path to a target.

Navigation Setup:
	•	NavMesh Generation: The game world is processed to generate a navigation mesh that AI characters can use for pathfinding.
	•	AI Movement: The AI moves by using UNavigationSystemV1::SimpleMoveToLocation or MoveToLocation for more complex paths.

Example:

UNavigationSystemV1::GetCurrent(GetWorld())->SimpleMoveToLocation(GetController(), TargetLocation);

7. Sensing and Awareness

AI in LifeVerse will use various sensors to detect players and other objects within the environment. Unreal’s PawnSensingComponent and custom sensory systems will be used for vision, hearing, and other stimuli.

Key Sensors:
	•	Vision: Detects the player within a line of sight.
	•	Hearing: Detects sounds or player actions (e.g., footsteps, gunfire).
	•	Proximity: AI detects nearby players within a specific radius.

Example Vision Sensor:

UPawnSensingComponent* PawnSensingComp = CreateDefaultSubobject<UPawnSensingComponent>(TEXT("PawnSensingComp"));
PawnSensingComp->OnSeePawn.AddDynamic(this, &ACustomAIController::OnSeePawn);

8. Environment Query System (EQS)

The Environment Query System (EQS) allows AI to query the environment and make decisions based on the results. For example, AI can choose the best cover, attack targets, or find the nearest item.

Key Features:
	•	Query Templates: Define specific queries that AI can perform (e.g., “find the nearest enemy” or “find the best cover”).
	•	Query Results: Return results based on the environment, such as a list of possible cover positions.

Example of querying an environment:

FEQSQueryResult QueryResult = FEnvironmentQueryInstance::RunQuery(BlackboardComp, QueryTemplate);

9. AI States and Transitions

AI will have different states (e.g., idle, patrol, alert, combat) that are triggered by environmental conditions or player actions. State transitions occur based on triggers defined in the Behavior Tree and Blackboard.

Example States:
	•	Idle: AI is not actively searching or engaging. It will transition to patrol or combat if certain conditions are met.
	•	Patrol: AI follows a set path around the world. It transitions to combat if a player is detected.
	•	Combat: AI engages in combat, using tactics such as flanking or taking cover.

10. Testing and Debugging AI

To ensure robust AI behavior, debugging tools and visual aids will be used:
	•	AI Debugging: Unreal Engine provides an AI debugging tool that allows developers to visualize behavior trees, see blackboard values, and view pathfinding results.
	•	Logging and Monitoring: Log key AI events (e.g., state transitions, detection events) to help track AI decision-making.

Enable AI debugging:

AActor* DebugActor = GetPawn();
GetWorld()->GetAIController(DebugActor)->DebugAI();

11. Conclusion

The AI architecture for LifeVerse is designed to provide realistic and immersive NPC behaviors. By using Unreal Engine’s AI tools like Behavior Trees, Blackboards, and EQS, we can create complex and responsive AI agents that adapt to the player’s actions and the dynamic world. The AI system will continuously evolve to meet the needs of gameplay, enhancing both the challenge and the narrative of LifeVerse.

Diese `AIArchitecture.md`-Datei bietet eine detaillierte Übersicht über das Design der KI-Architektur für dein Spiel. Sie deckt die wichtigsten Komponenten wie AI Controller, Behavior Trees, Pathfinding, und Sensing ab und zeigt, wie sie zusammenarbeiten, um intelligente, reaktive NPCs zu schaffen.