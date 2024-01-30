import { UniqueID } from "./value-objects/unique-id";

export abstract class Entity<Props> {
  private _id: UniqueID;
  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: UniqueID) {
    this.props = props;
    this._id = id ?? new UniqueID();
  }
}
