
import { GameObject, LayerMask, MonoBehaviour, Object, Physics, Quaternion, Random, Ray, RaycastHit, Transform, Vector3, WaitForSeconds } from "UnityEngine";
import RoundManager from "./RoundManager";
import Turret from "./Turret";
import Building from "./Building";
import ParticlePool from "./ParticlePool";
import EnemyDamage from "./EnemyDamage";
import DamagePool from "./DamagePool";
export default class EnemySpawner extends MonoBehaviour {

    @SerializeField private enemy: GameObject;
    @SerializeField private enemyBig: GameObject;
    @SerializeField private enemyFast: GameObject;
    @SerializeField private player: Transform;

    @SerializeField private parentNormal: Transform;
    @SerializeField private parentBig: Transform;
    @SerializeField private parentFast: Transform;

    @SerializeField private particlePool: ParticlePool;
    @SerializeField private damagePool: DamagePool;

    private poolListNormal: GameObject[] = [];
    private poolListBig: GameObject[] = [];
    private poolListFast: GameObject[] = [];

    private normalAmount: int = 45;
    private bigAmount: int = 15;
    private fastAmount: int = 15;

    //@SerializeField private turretParent: GameObject;
    @SerializeField public turrets: Turret[];

    private layerMask: int = (1 << LayerMask.NameToLayer("CustomLayer2")) | (1 << LayerMask.NameToLayer("CustomLayer6"));

    public static spawnFrequenzy: float = 2.5;
    public static killAll: bool;
    public static isSpawning: bool;
    public static wormsAlive: int = 0;
    private maxEnemies: int = 50;

    public static startSwarming: bool;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        EnemySpawner.spawnFrequenzy = 3.0;
        EnemySpawner.killAll = false;
        EnemySpawner.isSpawning = false;
        EnemySpawner.startSwarming = false;
        EnemySpawner.wormsAlive = 0;

        // Find turret references
        //this.turrets = this.turretParent.GetComponentsInChildren<Turret>();
        
        for (let i = 0; i < this.turrets.length; i++)
        {
            this.turrets[i].gameObject.SetActive(false);
        }

        // Spawn pools
        this.SpawnPools();

        // Start the spawner
        this.StartCoroutine(this.Spawner());
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private SpawnPools()
    {
        // Normal
        for(let i = 0; i < this.normalAmount; i++) {
            let temp = Object.Instantiate(this.enemy, this.parentNormal) as GameObject;
            temp.GetComponent<EnemyDamage>().particlePool = this.particlePool;
            temp.GetComponent<EnemyDamage>().damagePool = this.damagePool;
            temp.SetActive(false);
            this.poolListNormal[i] = temp;
        }

        // Big
        for(let i = 0; i < this.bigAmount; i++) {
            let temp = Object.Instantiate(this.enemyBig, this.parentBig) as GameObject;
            temp.GetComponent<EnemyDamage>().particlePool = this.particlePool;
            temp.GetComponent<EnemyDamage>().damagePool = this.damagePool;
            temp.SetActive(false);
            this.poolListBig[i] = temp;
        }

        // Fast
        for(let i = 0; i < this.fastAmount; i++) {
            let temp = Object.Instantiate(this.enemyFast, this.parentFast) as GameObject;
            temp.GetComponent<EnemyDamage>().particlePool = this.particlePool;
            temp.GetComponent<EnemyDamage>().damagePool = this.damagePool;
            temp.SetActive(false);
            this.poolListFast[i] = temp;
        }
    }

    *Spawner()
    {
        while(true)
        {
            // Wait
            let freq = (RoundManager.swarmRound) ? EnemySpawner.spawnFrequenzy / 2.0 : EnemySpawner.spawnFrequenzy; 
            yield new WaitForSeconds(freq);

            if (!EnemySpawner.isSpawning)
                continue;

            // Start Swarming if it's a swarm round, otherwise just spawn as usual
            if (EnemySpawner.startSwarming)
            {
                // Spawn a swarm to start the round
                let c = 10;
                c += RoundManager.round * 2;

                while (c > 0)
                {
                    c--;

                    let spawnPosition = this.FindSpawnPosition();
                    
                    // Spawn enemy
                    //Object.Instantiate(this.EnemyToSpawn(), spawnPosition, Quaternion.identity, this.transform);

                    let poolAmount = this.normalAmount;
                    let poolList = this.poolListNormal;

                    if (this.EnemyToSpawn() == 1)
                    {
                        poolAmount = this.bigAmount;
                        poolList = this.poolListBig;
                    }
                    else if (this.EnemyToSpawn() == 2)
                    {
                        poolAmount = this.fastAmount;
                        poolList = this.poolListFast;
                    }
                
                    let enemyToSpawn = this.GetPooledObject(poolAmount, poolList);

                    if (enemyToSpawn != null)
                    {
                        enemyToSpawn.transform.position = spawnPosition;
                        enemyToSpawn.SetActive(true);

                        // Increase count
                        EnemySpawner.wormsAlive++;
                    }

                    yield new WaitForSeconds(0.1);
                }

                EnemySpawner.startSwarming = false;
            }

            // Look for spawn point
            let spawnPosition = this.FindSpawnPosition();

            if (EnemySpawner.wormsAlive < this.maxEnemies)
            {
                // Spawn enemy
                //Object.Instantiate(this.EnemyToSpawn(), spawnPosition, Quaternion.identity, this.transform);

                let poolAmount = this.normalAmount;
                let poolList = this.poolListNormal;

                if (this.EnemyToSpawn() == 1)
                {
                    poolAmount = this.bigAmount;
                    poolList = this.poolListBig;
                }
                else if (this.EnemyToSpawn() == 2)
                {
                    poolAmount = this.fastAmount;
                    poolList = this.poolListFast;
                }
                
                let enemyToSpawn = this.GetPooledObject(poolAmount, poolList);

                if (enemyToSpawn != null)
                {
                    enemyToSpawn.transform.position = spawnPosition;
                    enemyToSpawn.SetActive(true);

                    // Increase count
                    EnemySpawner.wormsAlive++;
                }
            }
        }
    }

    // 0 = normal, 1 = big, 2 = fast
    private EnemyToSpawn() : int
    {
        let tempEnemy = 0;

        let randomNumber = Random.Range(0.0, 100.0);
        if (randomNumber < 92)
        {
            if (RoundManager.round > 6 && randomNumber < 10)
            {
                // Fast enemy
                tempEnemy = 2;
            }

            // Normal enemy
        }
        else if (RoundManager.round > 3)
        {
            // Big enemy
            tempEnemy = 1;
        }

        return tempEnemy;
    }

    private FindSpawnPosition() : Vector3
    {
        let spawnPos = Vector3.zero; 

        // max 100 tries to prevent crash
        let spawnFound = false;
        let count = 5;

        while (!spawnFound && count > 0)
        {
            count--;

            // Make a random position in the world based on the size of the island
            let xRandom = Random.Range(-15.0, 18.0);
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
                    //console.log(`No Spawn was Found`);
                }
            }
        }

        return spawnPos;
    }

    private IsTooCloseToPlayer(randomPosition: Vector3) : bool
    {
        let inRange = false;
        let playerPosition = this.player.position;

        let xMin = playerPosition.x - 5.0; // 4 > 6
        let xMax = playerPosition.x + 5.0;
        let zMax = playerPosition.z + 12.0;
        let zMin = playerPosition.z - 12.0;

        if (randomPosition.x < xMax && randomPosition.x > xMin && randomPosition.z < zMax && randomPosition.z > zMin)
        {
            inRange = true;
        }
        //else if (randomPosition.z < zMax && randomPosition.z > zMin)
        //{
        //    inRange = true;
        //}

        return inRange;
    }

    private GetPooledObject(poolAmount: int, poolList: GameObject[]) : GameObject {
        let result = null;
    
        for(let i = 0; i < poolAmount; i++) {
            let temp = poolList[i];
            if(!temp.activeInHierarchy) {
                result = temp;
                break;
            }
        }
    
        return result;
    }

    public GameOver() : void
    {
        this.StopAllCoroutines();
    }
}
