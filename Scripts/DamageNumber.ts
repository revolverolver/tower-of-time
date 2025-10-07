
import { TextMeshProUGUI } from "TMPro";
import { MonoBehaviour, Time, Vector3 } from "UnityEngine";
export default class DamageNumber extends MonoBehaviour {

    @SerializeField private text: TextMeshProUGUI;
    private time: float = 0.5;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        this.time -= Time.deltaTime;

        if (this.time < 0)
            this.Hide();
    }

    public SetNumber(damage: int, enemyType: int) : void 
    {
        if (enemyType == 1)
        {
            this.transform.position += Vector3.up * 0.3;
        }

        this.text.text = damage.toString();
        this.time = 0.5;
    }

    private Hide() : void
    {
        this.gameObject.SetActive(false);
    }
}
