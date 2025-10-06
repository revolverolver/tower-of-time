
import { GameObject, MonoBehaviour, Object, Transform, Vector3 } from "UnityEngine";
import DamageNumber from "./DamageNumber";

export default class DamagePool extends MonoBehaviour {

    @SerializeField private player: Transform;
    @SerializeField private damageText: GameObject;

    private poolList: GameObject[] = [];

    private poolAmount: int = 25;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.SpawnPool();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public ShowDamageText(position: Vector3, damage: int, enemyType: int) : void
    {
        if (Vector3.Distance(position, this.player.position) > 9)
            return;

        let text = this.GetPooledObject();

        if (text != null)
        {
            text.GetComponent<DamageNumber>().SetNumber(damage, enemyType);
            text.transform.position = position;
            text.SetActive(true);
        }
    }

    private SpawnPool()
    {
        for(let i = 0; i < this.poolAmount; i++) {
            let temp = Object.Instantiate(this.damageText, this.transform) as GameObject;
            temp.SetActive(false);
            this.poolList[i] = temp;
        }
    }

    private GetPooledObject() : GameObject {
        let result = null;
    
        for(let i = 0; i < this.poolAmount; i++) {
            let temp = this.poolList[i];
            if(!temp.activeInHierarchy) {
                result = temp;
                break;
            }
        }
    
        return result;
    }
}
