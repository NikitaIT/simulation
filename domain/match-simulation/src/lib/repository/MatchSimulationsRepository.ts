import { MatchSimulation } from '../entity';

export class MatchSimulationsRepository {
  constructor(private simulationById: Map<number, MatchSimulation>) {}
  getById(id: number) {
    return this.simulationById.get(id);
  }
  getByIds(ids: number[]): MatchSimulation[] {
    return ids.map((id) => this.getById(id)).filter((x) => x);
  }
}
