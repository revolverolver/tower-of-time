
import { GameObject, LayerMask, MonoBehaviour, Object, Physics, Quaternion, Random, Ray, RaycastHit, Transform, Vector3, WaitForSeconds } from "UnityEngine";
import RoundManager from "./RoundManager";
export default class EnemySpawner extends MonoBehaviour {

    @SerializeField private enemy: GameObject;
    @SerializeField private player: Transform;

    private layerMask: int = (1 << LayerMask.NameToLayer("CustomLayer2")) | (1 << LayerMask.NameToLayer("CustomLayer6"));

    private spawnFrequenzy: float = 3.0;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.StartCoroutine(this.Spawner());
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    *Spawner()
    {
        while(true)
        {
            // Wait
            yield new WaitForSeconds(this.spawnFrequenzy);

            // If it's not a spawn round, don't spawn
            if (!RoundManager.swarmRound)
                continue;

            // Look for spawn point
            let spawnPosition = this.FindSpawnPosition();

            // Spawn enemy
            Object.Instantiate(this.enemy, spawnPosition, Quaternion.identity, this.transform);
        }
    }

    private FindSpawnPosition() : Vector3
    {
        let spawnPos = Vector3.zero; 

        // max 100 tries to prevent crash
        let spawnFound = false;
        let count = 100;

        while (!spawnFound && count > 0)
        {
            count--;

            // Make a random position in the world based on the size of the island
            let xRandom = Random.Range(-15.0, 15.0);
            let zRandom = Random.Range(-17.0, 10.0);
            let randomPosition = new Vector3(xRandom, 0, zRandom);

            // Make sure the random position is far away enough from the player, to prevent seeing the enemies spawn
            if (this.IsTooCloseToPlayer(randomPosition) == true)
                continue;

            // If randomPosition is not too close, check if the position is okay to spawn at, or if there is a collider in the way
            randomPosition.y = 10;
            let ray = new Ray(randomPosition, Vector3.down);
            let hit = $ref<RaycastHit>();

            if (Physics.Raycast(ray, hit, 20, this.layerMask))
            {
                if (hit.value.transform.tag == "SpawnArea")
                {
                    // Found a spawn point!
                    spawnPos = hit.value.point;
                    spawnFound = true;
                }
                else
                {
                    // No spawn found, try again
                    console.log(`No Spawn was Found`);
                }
            }
        }

        return spawnPos;
    }

    private IsTooCloseToPlayer(randomPosition: Vector3) : bool
    {
        let inRange = false;
        let playerPosition = this.player.position;

        let xMin = playerPosition.x - 6.0; // 4 > 6
        let xMax = playerPosition.x + 6.0;
        let zMax = playerPosition.z + 12.0;
        let zMin = playerPosition.z - 13.0;

        if (randomPosition.x < xMax && randomPosition.x > xMin)
        {
            inRange = true;
        }
        else if (randomPosition.z < zMax && randomPosition.z > zMin)
        {
            inRange = true;
        }

        return inRange;
    }
}
