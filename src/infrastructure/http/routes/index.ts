import { Router } from 'express';
import { ProducerController } from '../controllers/ProducerController';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const producerController = new ProducerController();
const healthController = new HealthController();

router.get('/health', (req, res) => {
  healthController.check(req, res);
});

router.get('/producers/awards-interval', (req, res) => {
  producerController.getAwardsInterval(req, res);
});

export { router };
