import { Router } from 'express';
import { ProducerController } from '../controllers/ProducerController';

const router = Router();
const producerController = new ProducerController();

router.get('/producers/awards-interval', (req, res) => {
  producerController.getAwardsInterval(req, res);
});

export { router };

