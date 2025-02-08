import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // constructor(
  //   @Inject(DrizzleAsyncProvider)
  //   private database: NodePgDatabase<typeof sc>,
  // ) {}
  // async createPost(userId: number, createPostDto: CreatePostDto) {
  //   const [post] = await this.db
  //     .insert(sc.posts)
  //     .values({ authorId: userId, ...createPostDto })
  //     .returning();
  //   const [newpost] = await this.createPost(userId).where(
  //     q.eq(sc.posts.id, post.id),
  //   );
  //   return newpost;
  // }
  // async create(data: UserCreateDto): Promise<User> {
  //   const user = this.database.insert(s;
  //   return this.userRepository.save(user);
  // }
  // async findAll(): Promise<User[]> {
  //   return this.userRepository.find();
  // }
  // async findByEmail(email: string): Promise<User> {
  //   return this.userRepository.findOne({
  //     where: { email: email },
  //   });
  // }
  // async update(id: string, updateUserDto: UserUpdateDto): Promise<User> {
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.userRepository.findOne({
  //     where: { id },
  //   });
  // }
  // async remove(id: string): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}
