import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoryRepository);

    const checkCategory = await categoryRepository.findOne({
      where: { title },
    });

    if (checkCategory) {
      return checkCategory;
    }

    const category = categoryRepository.create({
      title,
    });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
