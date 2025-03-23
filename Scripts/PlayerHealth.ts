
import { Animator, MonoBehaviour, Transform, Vector3 } from "UnityEngine";
export default class PlayerHealth extends MonoBehaviour {

    @SerializeField private healthBar: Transform;
    @SerializeField private animator: Animator;

    private health: int = 10;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public ReceiveDamage(damage: int) : void
    {
        if (this.health <= 0)
            return;

        this.health -= damage;

        // Update health bar
        let x = this.health / 10;
        this.healthBar.localScale = new Vector3(x, 1, 1);

        // Play damage animation
        this.animator.enabled = true;
        this.animator.Play("Damaged", -1, 0);

        if (this.health <= 0)
        {
            // Died and game over

        }
    }
}
