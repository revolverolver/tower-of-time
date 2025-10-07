
import { GameObject, MonoBehaviour, Object, Transform, Vector3 } from "UnityEngine";

export default class ParticlePool extends MonoBehaviour {

    @SerializeField private particlesNormal: GameObject;
    @SerializeField private particlesBig: GameObject;
    @SerializeField private particlesFast: GameObject;

    @SerializeField private parentNormal: Transform;
    @SerializeField private parentBig: Transform;
    @SerializeField private parentFast: Transform;

    private poolListNormal: GameObject[] = [];
    private poolListBig: GameObject[] = [];
    private poolListFast: GameObject[] = [];

    private normalAmount: int = 5;
    private bigAmount: int = 5;
    private fastAmount: int = 5;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.SpawnPools();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private SpawnPools()
    {
        // Normal
        for(let i = 0; i < this.normalAmount; i++) {
            let temp = Object.Instantiate(this.particlesNormal, this.parentNormal) as GameObject;
            temp.SetActive(false);
            this.poolListNormal[i] = temp;
        }

        // Big
        for(let i = 0; i < this.bigAmount; i++) {
            let temp = Object.Instantiate(this.particlesBig, this.parentBig) as GameObject;
            temp.SetActive(false);
            this.poolListBig[i] = temp;
        }

        // Fast
        for(let i = 0; i < this.fastAmount; i++) {
            let temp = Object.Instantiate(this.particlesFast, this.parentFast) as GameObject;
            temp.SetActive(false);
            this.poolListFast[i] = temp;
        }
    }

    public SpawnParticles(type: int, position: Vector3) : void
    {
        let poolAmount = this.normalAmount;
        let poolList = this.poolListNormal;

        if (type == 1)
        {
            poolAmount = this.bigAmount;
            poolList = this.poolListBig;
        }
        else if (type == 2)
        {
            poolAmount = this.fastAmount;
            poolList = this.poolListFast;
        }

        let particle = this.GetPooledObject(poolAmount, poolList);

        if (particle != null)
        {
            particle.transform.position = position;
            particle.SetActive(true);
        }
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
}
